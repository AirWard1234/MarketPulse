import React from 'react'
import { SentimentCards } from './sentimentCards'
import SentimentChart from './sentimentChart'
import { SimpleTreemap } from './heatmap'
import { FiActivity } from 'react-icons/fi'

export const Grid = () => {
  return (
    <div className='px-4 grid gap-3 grid-cols-12'>
        <SentimentCards />
        <div className="col-span-8 grid h-135 shadow rounded-xl px-5 py-4 border border-stone-300">
          <SentimentChart />
          
        </div>
        <div className="col-span-4 grid mt-16.5 h-100 shadow rounded-xl px-5 py-4 border border-stone-300">
          <SimpleTreemap />
        </div>
        <div className="col-span-12 grid h-[50vh] shadow rounded-xl px-5 py-4 border border-stone-300">
        </div>
        <div className="col-span-12 flex justify-center items-center mt-5">
          <FiActivity className='text-2xl font-semibold mr-1'/>
          <h2 className="text-2xl font-semibold">Market Pulse</h2>
        </div>
    </div>
  )
}

