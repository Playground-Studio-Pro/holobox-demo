export default function SideButtons({ buttons, activeId, onPress }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      padding: '0 10px',
      width: 80,
      flexShrink: 0,
      zIndex: 5,
      background: 'transparent',
    }}>
      {buttons.map(btn => (
        <button
          key={btn.id}
          className={`btn-ghost${activeId === btn.id ? ' active' : ''}`}
          style={{ width: 60, minHeight: 72 }}
          onPointerUp={() => onPress(btn)}
        >
          <span className="icon" style={{ fontSize: 22 }}>{btn.icon}</span>
          <span className="label">{btn.label}</span>
        </button>
      ))}
    </div>
  )
}
