import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

//input fields
test.describe('form layouts page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const theGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await theGridEmailInput.fill('test@test.com')
        //to clear the field
        await theGridEmailInput.clear()

        //if you wanna see the text being typed in sequentially
        await theGridEmailInput.pressSequentially('test2@test.com', {delay: 200})

        //how to make generic assertions of the input field
        // first grab text from the iput field
         const inputValue = await theGridEmailInput.inputValue()
         expect(inputValue).toEqual('test2@test.com')

         //locator assertion
         await expect(theGridEmailInput).toHaveValue('test2@test.com')

    })

    //Radio buttons - how to select them and bypass usage
test('radio buttons',async ({page}) => {
   
    const theGridFom = page.locator('nb-card', {hasText: "Using the Grid"})
       
    //getByLabel option - normally the radio button on DevOps will show that it's "visually hidden" but use .check({force: true}) to bypass it.
       //await theGridFom.getByLabel('Option 1').check({force: true})
       //getByRole - different way to check the radio buttons
       await theGridFom.getByRole('radio', {name: 'Option 1'}).check({force: true})
       //how to validate if the selection was successfull - use .isChecked to validate if button is clicked or used and return as a boolean.
       const radioStatus = await theGridFom.getByRole('radio', {name: 'Option 1'}).isChecked()
       //Visual test example
       await expect(theGridFom).toHaveScreenshot({maxDiffPixels: 150})
       //expect(radioStatus).toBeTruthy()
       //second way to validate the status
       //await expect(theGridFom.getByRole('radio', {name: 'Option 1'})).toBeChecked()

       //selecting radio button 2 and then validate that the button has been checked but not the first button
       //await theGridFom.getByRole('radio', {name: 'Option 2'}).check({force: true})
       //expect(await theGridFom.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy() // radio button not selected
       //expect(await theGridFom.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy() // radio button is selected

       

    })
})

//Checkboxes
test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    //simple way to click the checkbox
    //check method will check the status of the checkbox but click method will actually click the checkbox but will not validate the checkbox
    //it's better to use the check method which is .uncheck and will unselect the checkbox
    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})
    //second checkbox
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})
    //check or uncheck all checkboxes
    //.all will create a list out of the locator
    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force: true})
        //validator
        expect(await box.isChecked()).toBeFalsy()
    }

})

//Lists & DropDowns
test('lists & dropDowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    //select items from the list
    page.getByRole('list') //can be used when the list has a UL tag
    page.getByRole('listitem') //when the list has LI tag

    //none of the two have options so go to this method of creating a locator
    //const optionList = page.getByRole('list').locator('nb-option')
    //diferrent approach
    const optionList = page.locator('nb-option-list nb-option') //nb-option-list - is the parent of the list of items & nb-option is the child
    //assertion that the list has all list items we expect by using locator assertion
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]) //just return by using all the expected items in the list
    //selection of items of any in the list
    await optionList.filter({hasText: "Cosmic"}).click()
    //validation of the background color
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    //validate every color of every selection option from the list
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)",
    }
    
    await dropDownMenu.click() //to open the menu and then start the loop
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color]) //to get the color as a list of colors
        //close the loop
        if(color != "Corporate"){ //if color is "Corporate" the loop should close but if not then the loop will continue
        await dropDownMenu.click() //to continue opening the menu and the loop until the list of colors have been selected   
        }
    }

})

//Tooltips
test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()
    //create a locator for the "Tooltip Placements" card.
    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await toolTipCard.getByRole('button', {name: 'Top'}).hover()
    
    //validate the tooltip
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

//Dialog boxes
test('dialog boxes', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
  //playwright automatically cancel the dialog box which does not allow you to delete a row in a table. Here's how to overcome that.
  //create a listener with page.on
  page.on('dialog', dialog =>{
    expect(dialog.message()).toEqual('Are you sure you want to delete?')
    //accept the option to delete the row
    dialog.accept()
  })

  //find locator for the nb-trash icon which in the DOM is located in the table > then the first table row (tr)
  await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
  //validation that the email we selected for the first row is not there anymore
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

//Web-Tables
test('web-tables', async({page}) => {
    //select user in the 3rd row by their unique identifier as their email and editing their age
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //get row by any text in this example row
    //click the edit button
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click()
    //in the DOM once the edit button is clicked the field immediately becomes an input text field(property value)
    //clear the placeholder
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    //fill it with new age
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    //click the checkmark to accept
    await page.locator('.nb-checkmark').click()

    //get the new row on a specific value
    //navigate to the 2nd page
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    //create a locator for the target row
    //we find the user by unique identifier which is 11 but there's another 11, so we filter by the index of the row and then get the role by text which is 11
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    //make assertion to validate that we made the change
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //test filter of the table - in the search filter, how to validate that only the data you want to be displayed are there and to validate if no data is found

    const ages = ['20', '30', '40', '200']

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age) //to fill out the age iterator in the for loop
        await page.waitForTimeout(500)
        //get all the rows from the table which you filtered for
        //create a locator for the rows
        const ageRows = page.locator('tbody tr')

        for(let row of await ageRows.all()){

            //find the last row by creating a locator for it
            const cellValue = await row.locator('td').last().textContent() //'td' is for column
            //playwright is faster then the actual filter so we need to create a delay
            //we need to create an if condition where we expect that no data will be found

            if(age == '200'){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }else{
                expect(cellValue).toEqual(age)
            }


        }
    }

})

//Date picker
test('date-picker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    //to select the date picker form
    const datePicker = page.getByPlaceholder('Form Picker')
    await datePicker.click()

    //how to automate the datepicker action without hard coding the dates by using a JavaScript date object
    let date = new Date()
    date.setDate(date.getDate() + 450)
    const expectedDate = date.getDate().toString()

    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calenderMonthYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthYear = `${expectedMonthLong} ${expectedYear}`

    while(!calenderMonthYear.includes(expectedMonthYear)){

        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calenderMonthYear = await page.locator('nb-calendar-view-mode').textContent()

    }

    //to select the actual date on the date picker
    //create a locator by selecting the date picker class for all value rows
    //the get by text only looks at partial match and not at the specific value youre looking for but by using {exact: true} you can specify the exact match
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(datePicker).toHaveValue(dateToAssert)

    
})

//Sliders
test('sliders', async({page}) => {
    //update the slider attribute
    /*const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '254.832')
        node.setAttribute('cy', '80.430')
    })
    await tempGauge.click()*/

    //mouse movement of sliders
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    //define a bounding box
    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x +100, y)
    await page.mouse.move(x +100, y +100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')

})

