import React from 'react'
import { SentimentCards } from './sentimentCards'
import SentimentChart from './sentimentChart'
import { SimpleTreemap } from './heatmap'
import { FiActivity } from 'react-icons/fi'
import { News } from './news'

export const Grid = () => {
  return (
    <div className='px-4 grid gap-3 grid-cols-12'>
        <SentimentCards />
        <div className="col-span-8 grid h-110 shadow rounded-xl px-5 py-4 border border-stone-300">
          <SentimentChart />
          
        </div>
        <div className="col-span-4 grid py-11 h-110 shadow rounded-xl px-5 border border-stone-300">
          <SimpleTreemap />
        </div>
        <div className="col-span-12 grid h-[63vh] shadow rounded-xl px-5 py-4 border border-stone-300 overflow-hidden">
          <News />
        </div>
        <div className="col-span-12 flex justify-center items-center mt-5">
          <FiActivity className='text-2xl font-semibold mr-1'/>
          <h2 className="text-2xl font-semibold">Market Pulse</h2>
        </div>
    </div>
  )
}

