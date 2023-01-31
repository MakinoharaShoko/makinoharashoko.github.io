// pages/posts/[id].js

// Generates `/posts/1` and `/posts/2`
import {getAllPosts, IPostsDesc} from "@/pages/api/getPostsList";
import ReactMarkdown from 'react-markdown'
import {useMarkdown} from "@/hooks/useMarkdown";
import {getPostDetail} from "@/pages/api/getPost/[name]";

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
  console.log(postAttr);
  const articleBody = <ReactMarkdown>{postBody}</ReactMarkdown>
  return <div>
    {articleBody}
  </div>
}
