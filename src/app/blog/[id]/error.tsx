'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="blog-detail-wrapper">
      <div className="blog-container">
        <div className="error-container">
          <div className="error-content">
            <h1>記事の読み込みに失敗しました</h1>
            <p>{error.message}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={reset}
                style={{
                  padding: '12px 24px',
                  background: '#42D200',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                再試行
              </button>
              <a 
                href="/"
                style={{
                  padding: '12px 24px',
                  background: '#6c757d',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}
              >
                ホームに戻る
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}