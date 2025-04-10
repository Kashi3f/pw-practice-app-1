import {test} from '../test-options'
import { PageManager } from '../page-objects/page_manager'
import {faker} from '@faker-js/faker'

test('parametrized methods', async({pageManager}) => {
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`


    //await pm.navigateTo().formLayoutsPage()
    await pageManager.onFormslayoutsPage().UsingTheGridForm(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    //this is to integrate screenshots to slack or other.
    //const buffer = await page.screenshot()
    //console.log(buffer.toString('base64'))
    await pageManager.onFormslayoutsPage().submitInlineForm(randomFullName, randomEmail, true)
    
})

