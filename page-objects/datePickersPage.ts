import {expect, Page} from '@playwright/test';

export class DatePickerPage{
    private readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async commonDatePicker(numberOfDaysFromToday: number){
         const datePicker = this.page.getByPlaceholder('Form Picker')
            await datePicker.click()
            const dateToAssert = await this.selectDateInCalender(numberOfDaysFromToday)
            await expect(datePicker).toHaveValue(dateToAssert)
    }

    async datePickerRange(startDate: number, endDate: number){
            const datePickerStartEnd = this.page.getByPlaceholder('Range Picker')
            await datePickerStartEnd.click()
            const dateToAssertStart = await this.selectDateInCalender(startDate)
            const dateToAssertEnd = await this.selectDateInCalender(endDate)
            const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
            await expect(datePickerStartEnd).toHaveValue(dateToAssert)


    }

    private async selectDateInCalender(numberOfDaysFromToday: number){
        //how to automate the datepicker action without hard coding the dates by using a JavaScript date object
        let date = new Date()
            date.setDate(date.getDate() + numberOfDaysFromToday)
            const expectedDate = date.getDate().toString()
        
            const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
            const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
            const expectedYear = date.getFullYear()
            const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
        
            let calenderMonthYear = await this.page.locator('nb-calendar-view-mode').textContent()
            const expectedMonthYear = `${expectedMonthLong} ${expectedYear}`
        
            while(!calenderMonthYear.includes(expectedMonthYear)){
        
                await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
                calenderMonthYear = await this.page.locator('nb-calendar-view-mode').textContent()
        
            }
        
            //to select the actual date on the date picker
            //create a locator by selecting the date picker class for all value rows
            //the get by text only looks at partial match and not at the specific value youre looking for but by using {exact: true} you can specify the exact match
            //await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()

            const dayCell = this.page.locator('[class="day-cell ng-star-inserted"]')
            const rangeCell = this.page.locator('[class="range-cell day-cell ng-star-inserted"]')
            if(await dayCell.first().isVisible()){
            await dayCell.getByText(expectedDate, {exact: true}).click()
            } else {
            await rangeCell.getByText(expectedDate, {exact: true}).click()
            }
            return dateToAssert
    }
}