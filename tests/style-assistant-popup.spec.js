import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Style Assistant popup desktop toggle', () => {
  test('popup header contains Agent and Support toggle buttons', () => {
    const src = fs.readFileSync(path.resolve('src/components/chat/StyleAssistantPopup.jsx'), 'utf-8')
    expect(src).toContain("onClick={() => setMode('agent')}")
    expect(src).toContain("onClick={() => setMode('support')}")
    expect(src).toContain('HiOutlineChatAlt2')
    expect(src).toContain('HiOutlineUserGroup')
    expect(src).toContain('Agent')
    expect(src).toContain('Support')
  })
})
