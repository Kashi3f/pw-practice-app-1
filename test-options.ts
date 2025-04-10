import {test as base} from '@playwright/test'
import { PageManager } from '../pw-practice-app/page-objects/page_manager'


export type TestOptions = {
    globalQaURL: string
    formLayOutsPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalQaURL: ['', {option: true}],
    formLayOutsPage: [async({page}, use) => {
        await page.goto('/')
        await page.getByText('forms').click()
        await page.getByText('Form Layouts').click()
        await use('')
    }, {auto: true}],

    pageManager: async({page}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }
})