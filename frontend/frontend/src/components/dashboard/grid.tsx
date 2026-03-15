import React from 'react'
import { SentimentCards } from './sentimentCards'
import SentimentChart from './sentimentChart'

export const Grid = () => {
  return (
    <div className='px-4 grid gap-3 grid-cols-12'>
        <SentimentCards />
        <SentimentChart />
    </div>
  )
}
