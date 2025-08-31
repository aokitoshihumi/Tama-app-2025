import Drawermenu from './component/Drawermenu/Drawermenu';
import Articles from './component/Articles/Articles';

export default async function Home() {
  try {
    const res = await fetch(
      'https://admin-panel-delta-six.vercel.app/api/blog'
    );

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    const blog = data?.posts || [];

    return (
      <>
        <div className='bgdesign'>
          <div>
            <Articles articles={blog} />
            <Drawermenu />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return (
      <div>
        <Articles articles={[]} />
        <p>データの読み込み中にエラーが発生しました。</p>
        <Drawermenu />
      </div>
    );
  }
}