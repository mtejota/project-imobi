import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

export default function ScreenDocumentUpload({ onBack }) {
  const [files, setFiles] = useState([
    { name: 'RG_CPF_Joao_Ferreira.pdf', size: '2.1 MB', status: 'Concluído' },
    { name: 'Comprovante_Renda_Beatriz.pdf', size: '890 KB', status: 'Processando' },
  ])
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 900)

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 900)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleMockUpload = () => {
    setFiles((prev) => [...prev, { name: `Novo_Documento_${prev.length + 1}.pdf`, size: '1.3 MB', status: 'Concluído' }])
  }

  const stats = useMemo(() => {
    const done = files.filter((file) => file.status === 'Concluído').length
    const processing = files.filter((file) => file.status === 'Processando').length
    return [
      ['Enviados', String(files.length), '#1d4ed8'],
      ['Concluídos', String(done), '#10b981'],
      ['Processando', String(processing), '#f59e0b'],
    ]
  }, [files])

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              background: '#fff',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            <Icon d={icons.back} size={15} /> Documentos
          </button>
          <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Upload de Documentos</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 320px', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 22 }}>
            <div style={{ border: '2px dashed #bfdbfe', borderRadius: 14, background: '#f8fbff', padding: '34px 20px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, margin: '0 auto 10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.upload} size={24} stroke='#1d4ed8' />
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Arraste arquivos aqui</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>PDF, DOCX, PNG e JPG até 15 MB por arquivo</div>
              <button
                onClick={handleMockUpload}
                style={{ border: 'none', background: '#1a56db', color: '#fff', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Selecionar arquivos
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isCompact ? 'repeat(3, minmax(0,1fr))' : '1fr', gap: 10 }}>
            {stats.map(([label, value, color]) => (
              <div key={label} style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', padding: '12px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ marginTop: 4, fontSize: 20, fontWeight: 800, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr 90px' : '2fr 120px 140px', padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
            <span style={thStyle}>Arquivo</span>
            <span style={thStyle}>Tamanho</span>
            {!isCompact && <span style={thStyle}>Status</span>}
          </div>

          {files.map((file, idx) => (
            <div key={`${file.name}-${idx}`} style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr 90px' : '2fr 120px 140px', padding: '12px 18px', borderBottom: idx < files.length - 1 ? '1px solid #f8fafc' : 'none', alignItems: 'center', gap: isCompact ? 10 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon d={icons.file} size={15} stroke='#1d4ed8' />
                </div>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                  {isCompact && <span style={{ fontSize: 11, fontWeight: 700, color: file.status === 'Concluído' ? '#10b981' : '#f59e0b' }}>{file.status}</span>}
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#64748b', fontFamily: "'DM Mono', monospace" }}>{file.size}</span>
              {!isCompact && <span style={{ fontSize: 11, fontWeight: 700, color: file.status === 'Concluído' ? '#10b981' : '#f59e0b' }}>{file.status}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const thStyle = { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }
