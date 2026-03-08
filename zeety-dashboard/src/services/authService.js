const TENANTS_STORAGE_KEY = 'zeety_tenants_v1'

function getTenants() {
  try {
    const raw = localStorage.getItem(TENANTS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveTenants(tenants) {
  localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants))
}

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function hashPassword(password) {
  // Mock local hash only for frontend validation while backend is pending.
  return `mock:${String(password || '').split('').reverse().join('')}`
}

function buildTenantSlug({ email }, tenants) {
  const emailDomain = normalizeEmail(email).split('@')[1] || ''
  const domainBase = emailDomain.split('.')[0] || 'cliente'
  const base = slugify(domainBase) || 'cliente'
  let slug = base
  let i = 2
  while (tenants.some((t) => t.slug === slug)) {
    slug = `${base}-${i}`
    i += 1
  }
  return slug
}

function findUserByEmail(tenants, email) {
  const normalizedEmail = normalizeEmail(email)
  for (const tenant of tenants) {
    const user = tenant.users.find((u) => u.email === normalizedEmail)
    if (user) return { tenant, user }
  }
  return null
}

function buildSessionPayload(tenant, user) {
  return {
    tenant: tenant.slug,
    tenantDb: tenant.databaseName,
    tenantName: tenant.name,
    email: user.email,
    name: user.name,
    creci: user.creci || '',
    userId: user.id,
    client: {
      id: tenant.client.id,
      plan: tenant.client.plan,
      status: tenant.client.status,
      createdAt: tenant.client.createdAt,
    },
  }
}

function wait(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function registerTenantUser({ name, email, password, creci }) {
  await wait(650)
  const safeName = String(name || '').trim()
  const safeEmail = normalizeEmail(email)
  const safePassword = String(password || '')
  const safeCreci = String(creci || '').trim()

  if (!safeName || !safeEmail || !safePassword || !safeCreci) {
    throw new Error('Preencha nome, e-mail, senha e CRECI para cadastrar.')
  }

  const tenants = getTenants()
  if (findUserByEmail(tenants, safeEmail)) {
    throw new Error('Este e-mail já está cadastrado. Faça login para continuar.')
  }

  const slug = buildTenantSlug({ email: safeEmail }, tenants)
  const now = new Date().toISOString()
  const tenant = {
    id: `tenant_${Date.now()}`,
    slug,
    name: safeName,
    databaseName: `zeety_${slug}`,
    createdAt: now,
    client: {
      id: `client_${Date.now()}`,
      plan: 'trial',
      status: 'active',
      createdAt: now,
    },
    users: [
      {
        id: `user_${Date.now()}`,
        name: safeName,
        email: safeEmail,
        creci: safeCreci,
        passwordHash: hashPassword(safePassword),
        role: 'owner',
        createdAt: now,
      },
    ],
  }

  saveTenants([...tenants, tenant])
  return { session: buildSessionPayload(tenant, tenant.users[0]) }
}

export async function loginTenantUser({ email, password }) {
  await wait(450)
  const safeEmail = normalizeEmail(email)
  const safePassword = String(password || '')

  if (!safeEmail || !safePassword) {
    throw new Error('Preencha e-mail e senha para continuar.')
  }

  const tenants = getTenants()
  const found = findUserByEmail(tenants, safeEmail)
  if (!found) {
    throw new Error('Usuário não encontrado. Faça seu cadastro primeiro.')
  }

  const expected = found.user.passwordHash
  if (expected !== hashPassword(safePassword)) {
    throw new Error('Senha inválida. Tente novamente.')
  }

  return { session: buildSessionPayload(found.tenant, found.user) }
}
