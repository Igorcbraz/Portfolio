import { string, node } from 'prop-types'

import './stepper.css'

export function Stepper({
  status = 'empty',
  children,
}) {
  return (
    <div class={`step ${status}`}>
      <div class='v-stepper'>
        <div class='circle' />
        <div class='line' />
      </div>

      <div class='content'>
        { children }
      </div>
    </div>
  )
}

Stepper.propTypes = {
  status: string,
  children: node,
}
