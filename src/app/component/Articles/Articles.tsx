"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Articles.css';

// APIのデータ構造に合わせたインターフェース
interface Article {
  id: string;
  title: string;
  body: any;
  createdAt: string;
  updatedAt: string;
  src: string;
  tag?: string; // tagフィールドを追加
}

interface ArticlesProps {
  articles: Article[];
}

export default function Articles({ articles }: ArticlesProps) {
  // Base64画像URLを作成する関数
  const getImageUrl = (srcString: string) => {
    if (!srcString) return '/placeholder.jpg';
    
    try {
      if (srcString.startsWith('data:image/')) {
        return srcString;
      }
      if (srcString.startsWith('http://') || srcString.startsWith('https://')) {
        return srcString;
      }
      return `data:image/jpeg;base64,${srcString}`;
    } catch (error) {
      console.error('画像のデコードエラー:', error);
      return '/placeholder.jpg';
    }
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    } catch (error) {
      console.error('日付のフォーマットエラー:', error);
      return dateString;
    }
  };

  // APIからタグを抽出する関数
  const extractTag = (article: Article) => {
    // 1. 直接tagフィールドをチェック
    if (article.tag) {
      return article.tag;
    }
    
    // 2. bodyオブジェクト内のtagをチェック
    if (article.body && typeof article.body === 'object') {
      // よくあるタグフィールド名を確認
      const possibleTagFields = ['tag', 'category', 'type', 'genre', 'label'];
      for (const field of possibleTagFields) {
        if (article.body[field]) {
          return article.body[field];
        }
      }
      
      // bodyが配列の場合の処理
      if (Array.isArray(article.body)) {
        for (const item of article.body) {
          if (item && typeof item === 'object') {
            for (const field of possibleTagFields) {
              if (item[field]) {
                return item[field];
              }
            }
          }
        }
      }
    }
    
    // 3. titleからカテゴリを推測（フォールバック）
    const title = article.title?.toLowerCase() || '';
    if (title.includes('グルメ') || title.includes('料理') || title.includes('食')) {
      return 'グルメ';
    } else if (title.includes('観光') || title.includes('スポット') || title.includes('景色')) {
      return '観光';
    } else if (title.includes('イベント') || title.includes('祭') || title.includes('体験')) {
      return 'イベント';
    } else if (title.includes('住') || title.includes('移住') || title.includes('生活')) {
      return '体験';
    }
    
    return 'お知らせ'; // デフォルト
  };

  return (
    <div className="articles-section">
      <div className="articles-header">
        <h1 className="main-title">たまっぷ</h1>
        <h2 className="sub-title">Pick Up</h2>
      </div>
      
      <div className="articles-grid">
        {articles.map((article) => (
          <Link href={`/blog/${article.id}`} key={article.id} className="article-card">
            <div className="article-image-wrapper">
              <Image
                src={getImageUrl(article.src)}
                alt={article.title}
                fill
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
                unoptimized
                className="article-image"
              />
            </div>
            <div className="article-info">
              <h3 className="article-title">{article.title}</h3>
              <div className="meta-container">
                <span className="article-date">{formatDate(article.createdAt)}</span>
                <span className="article-tag">{extractTag(article)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}