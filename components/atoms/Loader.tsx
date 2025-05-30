import styles from '@/styles/components/loader.module.scss'

export function Loader({ isLinear = false }: { isLinear?: boolean }) {
  return isLinear ? (
    <div className={styles['line-loader']}></div>
  ) : (
    <div className={styles.loader}>
      <div className={styles['loader-dot']}></div>
    </div>
  )
}