/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo, useState } from 'react'
import { Text } from '@pancakeswap/uikit'
import { ThemeContext } from 'styled-components'
import { STAKING_GENESIS } from '../../state/stake/hooks'
import { REWARDS_DURATION_DAYS_180 } from '../../state/stake/constants'

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export function Countdown({ exactEnd, durationDays }: { exactEnd?: Date; durationDays?: number }) {
  const theme = useContext(ThemeContext)
  const rewardsDuration = durationDays ? DAY * durationDays : REWARDS_DURATION_DAYS_180
  // get end/beginning times
  const end = useMemo(
    () => (exactEnd ? Math.floor(exactEnd.getTime() / 1000) : STAKING_GENESIS + rewardsDuration),
    [exactEnd],
  )
  const begin = useMemo(() => end - rewardsDuration, [end])

  // get current time
  const [time, setTime] = useState(() => Math.floor(Date.now() / 1000))
  useEffect((): (() => void) | void => {
    // we only need to tick if rewards haven't ended yet
    if (time <= end) {
      const timeout = setTimeout(() => setTime(Math.floor(Date.now() / 1000)), 1000)
      return () => {
        clearTimeout(timeout)
      }
    }
    return () => {
      console.log('already ended')
    }
  }, [time, end])

  const timeUntilGenesis = begin - time
  const timeUntilEnd = end - time

  let timeRemaining: number
  let message: string
  if (timeUntilGenesis >= 0) {
    message = 'Rewards begin in'
    timeRemaining = timeUntilGenesis
  } else {
    const ongoing = timeUntilEnd >= 0
    if (ongoing) {
      message = 'End in'
      timeRemaining = timeUntilEnd
    } else {
      message = 'Rewards have ended!'
      timeRemaining = Infinity
    }
  }

  const days = (timeRemaining - (timeRemaining % DAY)) / DAY
  timeRemaining -= days * DAY
  const hours = (timeRemaining - (timeRemaining % HOUR)) / HOUR
  timeRemaining -= hours * HOUR
  const minutes = (timeRemaining - (timeRemaining % MINUTE)) / MINUTE
  timeRemaining -= minutes * MINUTE
  const seconds = timeRemaining

  return (
    <Text fontWeight={400}>
      {message}{' '}
      {Number.isFinite(timeRemaining) && (
        <code style={{ color: theme.colors.primary }}>
          {`${days}D / ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`}
        </code>
      )}
    </Text>
  )
}
