import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 데이터 유효성 검사
    if (!data || !data.studentId || !data.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 타임스탬프 추가
    const newSubmission = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    // Firestore 'submissions' 컬렉션에 데이터 추가
    const docRef = await addDoc(collection(db, 'submissions'), newSubmission);

    return NextResponse.json({ success: true, id: docRef.id, submission: newSubmission }, { status: 201 });
  } catch (error) {
    console.error('Error saving submission to Firestore:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
