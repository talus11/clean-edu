"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, ShieldCheck } from 'lucide-react';

export default function TeacherSecretDataPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();
        // 최신 제출이 위로 오도록 역순 정렬
        setData(json.reverse());
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <div className="nav" style={{ justifyContent: 'flex-start' }}>
        <Link href="/" className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <ArrowLeft size={18} />
          돌아가기
        </Link>
      </div>

      <div className="header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '2rem' }}>
          <ShieldCheck size={32} color="var(--primary)" />
          교사용 관리자 페이지
        </h1>
        <p>선생님만 확인할 수 있는 학생들의 원본 데이터입니다. 이 주소는 외부에 공개하지 마세요.</p>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={20} color="var(--primary)" />
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>수집된 원데이터 목록 (총 {data.length}건)</h2>
        </div>

        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            데이터를 불러오는 중입니다...
          </div>
        ) : data.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            아직 제출된 데이터가 없습니다.
          </div>
        ) : (
          <div className="table-wrapper" style={{ margin: 0, border: 'none', borderRadius: 0, boxShadow: 'none' }}>
            <table style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th>제출일시</th>
                  <th>학번</th>
                  <th>이름</th>
                  <th>총점</th>
                  <th>평가 결과</th>
                  <th>나의 강점</th>
                  <th>부족한 점</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id || index}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {formatDate(item.timestamp)}
                    </td>
                    <td style={{ fontWeight: '600' }}>{item.studentId}</td>
                    <td style={{ fontWeight: '600' }}>{item.name}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: item.totalScore >= 30 ? '#15803d' : item.totalScore >= 24 ? '#1d4ed8' : '#b91c1c'
                      }}>
                        {item.totalScore}점
                      </span>
                    </td>
                    <td>{item.resultCategory}</td>
                    <td style={{ fontSize: '0.9rem', maxWidth: '200px' }}>{item.strength || '-'}</td>
                    <td style={{ fontSize: '0.9rem', maxWidth: '200px' }}>{item.weakness || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
