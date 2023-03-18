// pages/posts/[id].js

// Generates `/posts/1` and `/posts/2`
import {getAllPosts} from "@/pages/api/getPostsList";
import ReactMarkdown from 'react-markdown'
import {useMarkdown} from "@/hooks/useMarkdown";
import {getPostDetail} from "@/pages/api/getPost/[name]";
import s from './post.module.scss'
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useTagsStore} from "@/store/tags";
import backIcon from '../../assets/back.png';
import closeIcon from '../../assets/close.png';
import Image from "next/image";
import hljs from 'highlight.js';
import "highlight.js/styles/github.css";
import 'katex/dist/katex.min.css';
import renderMathInElement from "katex/contrib/auto-render";
import remarkGfm from 'remark-gfm';

export async function getStaticPaths() {
  const pages = await getAllPosts();
  const paths = pages.filter(page => page.extName.toLowerCase() === '.md' || page.extName.toLowerCase() === '.markdown')
    .map(page => ({
      params: {id: page.name}
    }))
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: any) {
  const fileName = context.params.id;
  const post = await getPostDetail(fileName)
  return {
    props: {
      post
    }
  }
}

export default function Post({post}: { post: string }) {
  const article = useMarkdown(post);
  const postAttr = article.attributes;
  const postBody = article.body;
  const route = useRouter();
  const tags = useTagsStore();
  // @ts-ignore
  const title = postAttr?.title ?? '未命名'
  const path = route.asPath;
  useEffect(() => {
    if (!tags.tags.find(e => e.url === path))
      tags.addTag({title, url: path})
    hljs.highlightAll();
    renderMathInElement(document.body, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '\\[', right: '\\]', display: true},
        {left: '$', right: '$', display: true},
        {left: '\\(', right: '\\)', display: true},
      ],
      throwOnError: false
    });
  }, [])


  const close = () => {
    // 关闭当前页，跳到主页
    route.replace('/').then();
    tags.deleteTag(path);
  }

  const back = () => {
    route.back();
  }

  const articleBody = <ReactMarkdown remarkPlugins={[remarkGfm]}>{postBody}</ReactMarkdown>
  return <div className={s.post}>
    <div className={s.top}>
      <div className={s.b} onClick={back}>
        <Image className={s.bi} src={backIcon} alt={'back'}/>
      </div>
      <div className={s.tit}>
        {title}
      </div>
      <div className={s.b} onClick={close}>
        <Image className={s.bi} src={closeIcon} alt={'close'}/>
      </div>
    </div>
    <div className={'markdown-body' + ' ' + s.md}>
      {articleBody}
    </div>
  </div>
}
