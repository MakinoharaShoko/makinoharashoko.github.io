import fm from "front-matter";

export function useMarkdown(sourceMarkdown:string){
  const postObj = fm(sourceMarkdown);
  return {body:postObj.body,attributes:postObj.attributes}
}
