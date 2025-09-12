import './Button.scss'

function Button({ children, onClick, variant = 'primary', className = '', ...rest }) {
  const cls = `btn ${variant === 'secondary' ? 'btn--secondary' : 'btn--primary'} ${className}`
  return (
    <button onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  )
}

export default Button



