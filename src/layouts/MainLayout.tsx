import s from './mainLayout.module.css'
import {useTagsStore} from "@/store/tags";
import mdpic from '../assets/md.png'
import lc from '../assets/launcher.png';
import Image from "next/image";
import {useRouter} from "next/router";

export default function MainLayout(props: { children: JSX.Element }) {

  const tagsStore = useTagsStore();
  const route = useRouter();

  const switchTag = (tagUrl: string) => {
    tagsStore.setCurrentActiveUrl(tagUrl);
    route.push(tagUrl).then()
  }

  const tagsDisplay = tagsStore.tags.map(tag => {
    const currentPath = route.asPath
    console.log(route)
    console.log(currentPath)
    console.log(tag.url)
    return <div className={s.tag + ' ' + (currentPath === tag.url ? s.tagActive : '')} key={tag.url}
                onClick={() => switchTag(tag.url)}>
      <Image className={s.tagImg} src={mdpic} alt={'md'}/>
    </div>
  })

  return <div className={s.out} style={{height:"calc(100vh - var(--vh-offset, 0px))"}}>
    <div className={s.mainarea}>
      {props.children}
    </div>
    <div className={s.bottom}>
      <div className={s.tag} key={'launcher'} onClick={() => route.push('/')}>
        <Image className={s.tagImg} src={lc} alt={'launcher'}/>
      </div>
      {tagsDisplay}
    </div>
  </div>
}
