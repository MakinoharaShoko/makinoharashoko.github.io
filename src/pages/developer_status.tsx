import {useRouter} from "next/router";
import {useEffect} from "react";
import styles from './developerStatus.module.scss'
import {uv} from "react-usevalue-hook";


export function DeveloperStatusView(props: { user: string }) {

  const showName = uv('');
  const avatar = uv('');
  const repoList = uv<any[]>([]);
  const totalStars = uv(0);

  async function getPageInfo() {
    const userInfoResp = await fetch(`https://api.github.com/users/${props.user}`);
    const userInfo = await userInfoResp.json();
    const repoCount: number = userInfo.public_repos;
    const name = userInfo.name;
    const avatarUrl = userInfo.avatar_url;
    const repos = [];
    let totalCount = 0;
    const totalPages = Math.ceil(repoCount / 100);
    for (let i = 0; i < totalPages; i++) {
      const pageResp = await fetch(`https://api.github.com/users/${props.user}/repos?per_page=100&page=${i+1}`);
      const pageData = await pageResp.json();
      for (const repo of pageData) {
        if (!repo.fork) {
          const stars: number = repo.stargazers_count;
          totalCount += stars;
          repos.push(repo);
        }
      }
    }
    showName.v = name;
    avatar.v = avatarUrl;
    repoList.v = repos;
    totalStars.v = totalCount;
  }

  useEffect(() => {
    getPageInfo().then();
  }, [props.user])
  const reposView = repoList.v.sort((a, b) => {
    return b.stargazers_count - a.stargazers_count;
  }).map(repo => {
    const desc = repo.description;
    const repoUrl = repo.html_url;
    const repoName = repo.name;
    const stars: number = repo.stargazers_count;
    return <div key={repoName} className={styles.repo}>
      <div>
        <a href={repoUrl}>{repoName}</a>
        <span> ⭐ {stars}</span>
      </div>
      <div>{desc}</div>
    </div>
  })

  return <main className={styles.main + ' ' + 'markdown-body'}>
    <div className={styles.info}>
      <div>
        <img className={styles.pic} src={avatar.v} alt={'avatar'}/>
      </div>
      <div style={{padding:'20px'}}>
        <h3>{showName.v}</h3>
        <h4>⭐ {totalStars.v}</h4>
      </div>
    </div>
    <div>
      {reposView}
    </div>
  </main>

}

export default function DeveloperStatus() {

  const router = useRouter();
  const {user} = router.query;
  return <DeveloperStatusView user={(user ?? '').toString()}/>
}
