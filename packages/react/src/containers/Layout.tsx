import React, { useContext, Fragment, useRef, useLayoutEffect } from 'react'
import { each } from '@clearx/designable-shared'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutProps } from '../types'
import cls from 'classnames'

export const Layout: React.FC<React.PropsWithChildren<IDesignerLayoutProps>> = (
  props,
) => {
  const layout = useContext(DesignerLayoutContext)
  const ref = useRef<HTMLDivElement | undefined>(undefined)

  useLayoutEffect(() => {
    if (ref.current) {
      each(props.variables, (value, key) => {
        ref.current.style.setProperty(`--${key}`, value)
      })
    }
  }, [])

  if (layout) {
    return <Fragment>{props.children}</Fragment>
  }

  const { prefixCls = 'dn-', theme = 'light', position = 'fixed' } = props

  return (
    <div
      ref={ref}
      className={cls({
        [`${prefixCls}app`]: true,
        [`${prefixCls}${theme}`]: theme,
      })}
    >
      <DesignerLayoutContext.Provider
        value={{
          theme: theme,
          prefixCls: prefixCls,
          position: props.position,
        }}
      >
        {props.children}
      </DesignerLayoutContext.Provider>
    </div>
  )
}
