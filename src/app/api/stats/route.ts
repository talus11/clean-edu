import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Firestore에서 모든 제출 데이터 가져오기 (시간순 정렬)
    const q = query(collection(db, 'submissions'), orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions from Firestore:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
