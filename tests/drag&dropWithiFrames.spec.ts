import {expect} from '@playwright/test'
import {test} from '../test-options'

test.beforeEach(async({page, globalQaURL}) => {
    await page.goto(globalQaURL)
})

//Drag and drop with iFrames
test('drag&Drop-iFrames', async({page}) => {
const frame = page.frameLocator('[rel-title="Photo Manager"] iFrame')

    await frame.locator('li', {hasText: 'High Tatras 2'}).dragTo(frame.locator('#trash'))

    //more precise control of mouse
    await frame.locator('li', {hasText: 'High Tatras 4'}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4'])
})