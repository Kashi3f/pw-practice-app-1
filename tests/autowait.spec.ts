import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    // to run test on localhost:4200 you need to run npm start to start up server and then run tests on browser
    await page.goto(process.env.URL)
   await page.getByText('Button Triggering AJAX Request').click()
 
})

//Auto Waiting
//to reduce flakyness in tests
test('auto waiting', async({page}) => {
   const successButton = page.locator('.bg-success')
   //await successButton.click()

   //to forcefully reduce the timeout got to playwright.config.ts > defineConfig and insert timeout: 10000, that's 10sec

   //different way to auto wait for attachment to display
   //await successButton.waitFor({state: "attached"})
   //const text = await successButton.textContent()

   
   //expect(text).toContain('Data loaded with AJAX get request.')

   //better way to auto wait and much more readible
   await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

//alternative waits
test('alternative waits', async({page}) => {
   const successButton = page.locator('.bg-success')

   //___wait for element
   //await page.waitForSelector('.bg-success')

   //___wait for particular response
   //normally API requests are displyed in your DevTools network
   //wait for the API call to be triggered
   //this is the best one
   //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

   //___wait for network calls to be completed(NOT RECOMMENDED) - it will wait till all the API calls is completed but your test will get stuck if the call is not completed
   await page.waitForLoadState('networkidle')



    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async({page}) => {
    const successButton = page.locator('.bg-success')
   await page.waitForSelector('.bg-success')
})

