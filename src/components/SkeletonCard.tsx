'use client'

interface SkeletonCardProps {
  variant?: 'webhook' | 'apiKey'
  count?: number
}

export default function SkeletonCard({ variant = 'webhook', count = 3 }: SkeletonCardProps) {
  const pulseKeyframes = `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `

  return (
    <>
      <style>{pulseKeyframes}</style>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          {/* Header with title and status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ flex: 1 }}>
              {/* Title skeleton */}
              <div
                style={{
                  height: '20px',
                  width: '60%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              />
              {/* Subtitle skeleton */}
              <div
                style={{
                  height: '14px',
                  width: '40%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                }}
              />
            </div>
            {/* Status badge skeleton */}
            <div
              style={{
                height: '24px',
                width: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
              }}
            />
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div
              style={{
                height: '24px',
                width: '80px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
              }}
            />
            <div
              style={{
                height: '24px',
                width: '90px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
              }}
            />
          </div>

          {/* URL or Key display */}
          <div
            style={{
              height: '40px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          />

          {variant === 'webhook' && (
            <>
              {/* Events */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    height: '12px',
                    width: '30%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    marginBottom: '8px',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div
                    style={{
                      height: '24px',
                      width: '120px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '6px',
                    }}
                  />
                  <div
                    style={{
                      height: '24px',
                      width: '100px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div>
              <div
                style={{
                  height: '12px',
                  width: '70%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '4px',
                  marginBottom: '6px',
                }}
              />
              <div
                style={{
                  height: '18px',
                  width: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div>
              <div
                style={{
                  height: '12px',
                  width: '70%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '4px',
                  marginBottom: '6px',
                }}
              />
              <div
                style={{
                  height: '18px',
                  width: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: variant === 'webhook' ? '8px' : '0',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '32px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
            />
            <div
              style={{
                flex: 1,
                height: '32px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
            />
            <div
              style={{
                height: '32px',
                width: '48px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
            />
          </div>

          {/* View Logs button for webhook variant */}
          {variant === 'webhook' && (
            <div
              style={{
                height: '32px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
            />
          )}
        </div>
      ))}
    </>
  )
}
