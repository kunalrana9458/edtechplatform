import React from 'react'
import RenderSteps from './RenderSteps'


export default function index() {
  return (
    <>
        <div className='text-white'>
            <div>
                <h1>Add Course</h1>
                <div>
                    <RenderSteps />
                </div>
            </div>
            <div>
                <p>Code Upload Tips </p>
                <ul>
                    <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores, explicabo!</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, non.</li>
                    <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis, blanditiis.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, necessitatibus?</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, consectetur.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, officiis!</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, aliquid.</li>
                </ul>
            </div>
        </div>
    </>
  )
}
