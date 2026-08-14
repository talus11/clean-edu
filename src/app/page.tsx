"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

const VIRTUES = [
  {
    id: 'responsibility',
    name: '1. 책임',
    desc: '사회에서 개인에게 주어진 일이나 몫을 다른 사람에게 미루지 않고 스스로 충실히 이행하는 것과 그에 따른 결과에 대한 의무까지 수행하는 것',
    questions: [
      { id: 'q1', text: '나는 맡은 일이나 역할을 끝까지 완수한다.' },
      { id: 'q2', text: '잘못했을 때 변명하지 않고 바로 인정하고 해결하려고 한다.' }
    ]
  },
  {
    id: 'honesty',
    name: '2. 정직',
    desc: '타인과 자신에게 거짓이나 꾸밈이 없고 올바르게 말과 행동을 실천하는 것',
    questions: [
      { id: 'q1', text: '이익을 위해서라도 거짓된 행동은 하지 않는다.' },
      { id: 'q2', text: '실수나 잘못된 점을 솔직하게 말한다.' }
    ]
  },
  {
    id: 'temperance',
    name: '3. 절제',
    desc: '욕구와 감정을 조절하고 내 것과 남의 것을 사용할 때 자신을 바르게 다스리는 (통제하는) 것',
    questions: [
      { id: 'q1', text: '하고 싶은 일이 있어도 해야 할 일을 먼저 한다.' },
      { id: 'q2', text: '휴대폰, 게임, 간식 등 유혹을 스스로 조절할 수 있다.' }
    ]
  },
  {
    id: 'promise',
    name: '4. 약속',
    desc: '앞으로의 일을 어떻게 할 것인지 미리 정하여 두고 그렇게 정한 내용을 지키고 실천하는 것',
    questions: [
      { id: 'q1', text: '약속한 일은 꼭 지킨다.' },
      { id: 'q2', text: '약속을 지키기 어려우면 미리 알린다.' }
    ]
  },
  {
    id: 'consideration',
    name: '5. 배려',
    desc: '어떤 조건 없이 사람, 그리고 사람 이외의 대상까지 도와주거나 보살피는 마음을 실천으로 옮기는 것',
    questions: [
      { id: 'q1', text: '내 말이나 행동이 다른 사람의 기분을 상하게 하지 않는지 생각한다.' },
      { id: 'q2', text: '도움이 필요한 친구를 먼저 살핀다.' }
    ]
  },
  {
    id: 'fairness',
    name: '6. 공정',
    desc: '공평하고 올바름, 즉 한 편으로 치우치지 않고 이치나 규범에 벗어남이 없도록 누구나 동등하고 공평하게 대우하는 것',
    questions: [
      { id: 'q1', text: '친구를 차별하지 않고 똑같이 대한다.' },
      { id: 'q2', text: '경쟁 상황에서도 정정당당하게 한다.' }
    ]
  }
];

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    scores: {} as Record<string, number>,
    bestVirtue: '',
    bestVirtueReason: '',
    improveVirtue: '',
    improveVirtueReason: '',
    pledge: ''
  });

  const [totalScore, setTotalScore] = useState(0);
  const [resultCategory, setResultCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const scoresArray = Object.values(formData.scores);
    const sum = scoresArray.reduce((acc, curr) => acc + curr, 0);
    setTotalScore(sum);

    if (sum >= 30) {
      setResultCategory('슈퍼스타');
    } else if (sum >= 24) {
      setResultCategory('성장기');
    } else if (sum > 0) {
      setResultCategory('챌린저');
    } else {
      setResultCategory('');
    }
  }, [formData.scores]);

  const handleScoreChange = (virtueId: string, qId: string, score: number) => {
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [`${virtueId}_${qId}`]: score
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const answeredQuestions = Object.keys(formData.scores).length;
    if (answeredQuestions < 12) {
      alert('모든 체크리스트 문항에 답해주세요.');
      return;
    }
    if (!formData.studentId || !formData.name) {
      alert('학번과 이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalScore,
          resultCategory
        })
      });

      if (res.ok) {
        router.push('/stats');
      } else {
        alert('제출에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="nav">
        <Link href="/stats" className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <BarChart3 size={18} />
          통계 보기
        </Link>
      </div>

      <div className="header">
        <p>배곧해솔중학교</p>
        <h1 style={{ marginBottom: '0.5rem' }}>미래세대 청렴교육</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>(모바일 환경에서는 가로로 보는 것을 추천드립니다.)</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ display: 'flex', gap: '2rem' }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label htmlFor="studentId">학번</label>
            <input 
              type="text" 
              id="studentId" 
              name="studentId" 
              value={formData.studentId} 
              onChange={handleInputChange}
              placeholder="예: 10101"
              required 
            />
          </div>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label htmlFor="name">이름</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange}
              placeholder="홍길동"
              required 
            />
          </div>
        </div>

        <div className="card">
          <h2>1. 청렴 6덕목 자기 점검</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            체크리스트 문항을 읽고, 해당하는 칸에 체크(✓)하세요.
          </p>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>덕목 및 정의</th>
                  <th style={{ width: '45%' }}>문항</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>항상 그렇다<br/><small>3점</small></th>
                  <th style={{ width: '10%', textAlign: 'center' }}>가끔 그렇다<br/><small>2점</small></th>
                  <th style={{ width: '10%', textAlign: 'center' }}>거의 아니다<br/><small>1점</small></th>
                </tr>
              </thead>
              <tbody>
                {VIRTUES.map((virtue, vIdx) => (
                  <React.Fragment key={virtue.id}>
                    <tr>
                      <td rowSpan={2}>
                        <div className="virtue-name">{virtue.name}</div>
                        <div className="virtue-desc">{virtue.desc}</div>
                      </td>
                      <td>
                        <div className="question-text">{virtue.questions[0].text}</div>
                      </td>
                      {[3, 2, 1].map(score => (
                        <td key={score} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <input 
                            type="radio" 
                            name={`${virtue.id}_q1`}
                            checked={formData.scores[`${virtue.id}_q1`] === score}
                            onChange={() => handleScoreChange(virtue.id, 'q1', score)}
                            style={{ width: '1.5rem', height: '1.5rem', accentColor: 'var(--primary)' }}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>
                        <div className="question-text">{virtue.questions[1].text}</div>
                      </td>
                      {[3, 2, 1].map(score => (
                        <td key={score} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <input 
                            type="radio" 
                            name={`${virtue.id}_q2`}
                            checked={formData.scores[`${virtue.id}_q2`] === score}
                            onChange={() => handleScoreChange(virtue.id, 'q2', score)}
                            style={{ width: '1.5rem', height: '1.5rem', accentColor: 'var(--primary)' }}
                          />
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="score-banner">
            <div>총점</div>
            <div className="score">{totalScore}점</div>
            {resultCategory && (
              <div className={`badge ${
                resultCategory === '슈퍼스타' ? 'superstar' : 
                resultCategory === '성장기' ? 'growth' : 'challenger'
              }`}>
                청렴 {resultCategory}
                {resultCategory === '슈퍼스타' && ' 🌟 (훌륭합니다! 계속 유지하세요)'}
                {resultCategory === '성장기' && ' 🌱 (좋지만 몇 가지 습관을 보완하세요)'}
                {resultCategory === '챌린저' && ' 🏃 (개선할 부분이 많아요. 하나씩 실천해 봅시다)'}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2>2. 생활 속 적용하기</h2>
          <div className="input-group">
            <label>내가 가장 잘 지키는 덕목은</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="text" name="bestVirtue" value={formData.bestVirtue} onChange={handleInputChange} style={{ width: '150px' }} placeholder="덕목 이름" />
              <span>이고, 그 이유는</span>
              <input type="text" name="bestVirtueReason" value={formData.bestVirtueReason} onChange={handleInputChange} style={{ flex: 1 }} placeholder="이유 작성" />
              <span>이다.</span>
            </div>
          </div>

          <div className="input-group">
            <label>내가 더 노력해야 하는 덕목은</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="text" name="improveVirtue" value={formData.improveVirtue} onChange={handleInputChange} style={{ width: '150px' }} placeholder="덕목 이름" />
              <span>이고, 이를 위해</span>
              <input type="text" name="improveVirtueReason" value={formData.improveVirtueReason} onChange={handleInputChange} style={{ flex: 1 }} placeholder="실천 방법 작성" />
              <span>를 해보겠다.</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>3. 나만의 청렴 다짐문 작성하기</h2>
          <div className="input-group">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span>"나는 앞으로</span>
              <input type="text" name="pledge" value={formData.pledge} onChange={handleInputChange} style={{ flex: 1 }} placeholder="나의 다짐 작성" />
              <span>을(를) 실천하여 청렴한 학생이 되겠습니다."</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.25rem', marginBottom: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? '제출 중...' : '제출하기'}
          </button>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            여러분들이 작성한 설문은 일시적으로 보관되며 추후 삭제될 예정입니다.
          </p>
        </div>
      </form>
    </div>
  );
}
