"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Star, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StatsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Poll for real-time data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const totalSubmissions = data.length;
  const averageScore = totalSubmissions > 0
    ? (data.reduce((acc, curr) => acc + curr.totalScore, 0) / totalSubmissions).toFixed(1)
    : '0.0';

  const superstarCount = data.filter(d => d.resultCategory === '슈퍼스타').length;
  
  // Compute distribution data
  const distribution = [
    { name: '12~17점', count: 0 },
    { name: '18~23점', count: 0 },
    { name: '24~29점', count: 0 },
    { name: '30~36점', count: 0 }
  ];

  data.forEach(sub => {
    if (sub.totalScore >= 30) distribution[3].count++;
    else if (sub.totalScore >= 24) distribution[2].count++;
    else if (sub.totalScore >= 18) distribution[1].count++;
    else distribution[0].count++;
  });

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <div className="nav" style={{ justifyContent: 'flex-start' }}>
        <Link href="/" className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <ArrowLeft size={18} />
          돌아가기
        </Link>
      </div>

      <div className="header">
        <h1>통계 대시보드</h1>
        <p>실시간으로 집계되는 청렴 교육 결과입니다.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label"><Users size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px', color: 'var(--primary)' }}/>참여자 수</div>
          <div className="value">{totalSubmissions}명</div>
        </div>
        <div className="stat-card">
          <div className="label"><TrendingUp size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px', color: '#3b82f6' }}/>평균 점수</div>
          <div className="value">{averageScore}점</div>
        </div>
        <div className="stat-card">
          <div className="label"><Star size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px', color: '#f59e0b' }}/>청렴 슈퍼스타</div>
          <div className="value">{superstarCount}명</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={24} color="var(--primary)" />
          점수 분포표
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>학생들의 총점 기준 분포 현황입니다.</p>
        
        {isLoading ? (
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            데이터를 불러오는 중입니다...
          </div>
        ) : totalSubmissions === 0 ? (
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            아직 제출된 데이터가 없습니다.
          </div>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dy={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                />
                <Bar dataKey="count" name="학생 수" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>


    </div>
  );
}
