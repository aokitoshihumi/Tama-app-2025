import React from 'react';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from 'next/link';
import './BlogDetail.css';

type Props = {
  params: Promise<{ id: string }>;
};

type BlogData = {
  id: string;
  title: string;
  body: JSON;
  createdAt: string;
  updatedAt: string;
  src: string;
  tag?: string[];
};

// 日付フォーマット関数
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    return dateString;
  }
}

// 画像URL処理関数
function getImageUrl(srcString: string): string {
  if (!srcString) return '/placeholder.jpg';
  
  if (srcString.startsWith('data:image/')) {
    return srcString;
  }
  
  if (srcString.startsWith('http://') || srcString.startsWith('https://')) {
    return srcString;
  }
  
  return srcString;
}

// タグ抽出関数
function getMainTag(blog: BlogData): string {
  if (blog.tag && Array.isArray(blog.tag) && blog.tag.length > 0) {
    return blog.tag[0];
  }
  
  // タイトルからカテゴリを推測
  const title = blog.title.toLowerCase();
  if (title.includes('移住') || title.includes('体験') || title.includes('インタビュー')) {
    return '体験';
  } else if (title.includes('グルメ') || title.includes('料理')) {
    return 'グルメ';
  } else if (title.includes('観光') || title.includes('スポット')) {
    return '観光';
  } else if (title.includes('イベント') || title.includes('祭')) {
    return 'イベント';
  }
  
  return 'お知らせ';
}

export default async function BlogDetails({ params }: Props) {
  const { id } = await params;
  
  try {
    const res = await fetch(
      `https://admin-panel-delta-six.vercel.app/api/blog/${id}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );
    
    if (!res.ok) {
      throw new Error(`レスポンスステータス: ${res.status}`);
    }
    
    const data = await res.json();
    const blog: BlogData = data.post || data;
    
    console.log('Blog data:', blog);
    
    const html = generateHTML(blog.body, [StarterKit, Image]);
    const mainTag = getMainTag(blog);
    
    return (
      <div className="blog-detail-wrapper">
        <div className="blog-container">
          {/* ナビゲーション */}
          <nav className="blog-nav">
            <Link href="/" className="nav-back">
              <span className="back-icon">←</span>
              記事一覧に戻る
            </Link>
          </nav>
          
          {/* メイン記事コンテンツ */}
          <article className="blog-article">
            {/* ヘッダー */}
            <header className="article-header">
              {/* メタ情報バー */}
              <div className="article-meta-bar">
                <div className="meta-left">
                  <span className="article-id">ID: {blog.id.slice(0, 8)}...</span>
                  <span className="article-category">{mainTag}</span>
                </div>
                <time className="blog-date">
                  {formatDate(blog.createdAt)}
                </time>
              </div>
              
              {/* タイトルセクション */}
              <div className="title-section">
                <h1 className="article-title">{blog.title}</h1>
                
                {/* タグ一覧表示 */}
                {blog.tag && Array.isArray(blog.tag) && blog.tag.length > 0 && (
                  <div className="article-tags">
                    {blog.tag.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>
            
            {/* メイン画像 */}
            {blog.src && (
              <div className="article-hero-image">
                <img 
                  src={getImageUrl(blog.src)}
                  alt={blog.title}
                  className="hero-image"
                />
              </div>
            )}
            
            {/* 記事本文 */}
            <div className="article-content">
              <div className="content-body">
                <div 
                  dangerouslySetInnerHTML={{ __html: html }}
                  className="tiptap-content"
                />
              </div>
            </div>
            
            {/* フッター */}
            <footer className="article-footer">
              <div className="article-info-section">
                <div className="info-card publish-info">
                  <h4>📅 投稿情報</h4>
                  <p>公開日: {formatDate(blog.createdAt)}</p>
                  {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                    <p>最終更新: {formatDate(blog.updatedAt)}</p>
                  )}
                </div>
                
                <div className="info-card tag-info">
                  <h4>🏷️ カテゴリ情報</h4>
                  {blog.tag && Array.isArray(blog.tag) && blog.tag.length > 0 ? (
                    <p>タグ: <span className="category-link">{blog.tag.join(', ')}</span></p>
                  ) : (
                    <p>カテゴリ: <span className="category-link">{mainTag}</span></p>
                  )}
                  <p>記事ID: <span className="article-id-full">{blog.id}</span></p>
                </div>
              </div>
              
              {/* 関連記事セクション */}
              <div className="related-articles">
                <h4>関連記事</h4>
                <div className="related-grid">
                  <div className="related-card">
                    <div className="related-image-placeholder">🏠</div>
                    <div className="related-content">
                      <h5>多摩での住まい探し体験談</h5>
                      <span className="related-tag">体験</span>
                    </div>
                  </div>
                  <div className="related-card">
                    <div className="related-image-placeholder">🌳</div>
                    <div className="related-content">
                      <h5>多摩の自然スポット巡り</h5>
                      <span className="related-tag">観光</span>
                    </div>
                  </div>
                  <div className="related-card">
                    <div className="related-image-placeholder">👥</div>
                    <div className="related-content">
                      <h5>地域コミュニティに参加してみた</h5>
                      <span className="related-tag">体験</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="article-actions">
                <Link href="/" className="return-home">
                  他の記事を見る
                </Link>
              </div>
            </footer>
          </article>
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('Blog fetch error:', error);
    
    return (
      <div className="error-container">
        <div className="error-content">
          <h1>記事が見つかりませんでした</h1>
          <p>記事ID: {id}</p>
          <p>お探しの記事は削除されたか、URLが間違っている可能性があります。</p>
          <Link href="/" className="back-home-btn">
            ホームページに戻る
          </Link>
        </div>
      </div>
    );
  }
}


