import s from './mainLayout.module.css'

export default function MainLayout(props: { children: JSX.Element }) {
  return <div className={s.out}>
    <div className={s.mainarea}>
      {props.children}
    </div>
    <div className={s.bottom}>
      123
    </div>
  </div>
}
