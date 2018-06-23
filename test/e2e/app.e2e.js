//import PersonSchema from '../../src/config/person-schema';
import {PageObjectAddPerson} from './add-person.po';
import {PageObjectSidebar} from './sidebar.po';
import {PageObjectRouter} from './router.po';
import {PageObjectTable} from './table.po';
import {config} from '../protractor.conf';

describe('base app', function() {
  let poSidebar;
  let poAddPerson;
  let poRouter;
  let poTable;

  beforeEach(async() => {
    poSidebar = new PageObjectSidebar();
    poRouter = new PageObjectRouter();
    poTable = new PageObjectTable();
    poAddPerson = new PageObjectAddPerson();

    await browser.loadAndWaitForAureliaPage(`http://localhost:${config.port}`);

    await browser.executeScript(`
      localStorage.setItem('storage-data-persons', JSON.stringify({
        items: [
          {id: 1, name: 'Bill Gates',        power: false, rich: true,  genius: true},
          {id: 2, name: 'Zaphod Beeblebrox', power: true,  rich: false, genius: false},
          {id: 3, name: 'Albert Einstein',   power: false, rich: false, genius: true},
        ],
        count: 3
       }));
      window.location.reload();
    `);
    await browser.driver.sleep(1000);
  });

  it('should start up with page total', async() => {
    expect(await browser.getTitle()).toBe('Total persons');
  });

  it('should display linked counts', async() => {
    expect(await poSidebar.getTotalFromFirstLink()).toBe('3');
    expect(await poSidebar.getAttributeCountFromLink('rich')).toBe('1');
    expect(await poSidebar.getAttributeCountFromLink('genius')).toBe('2');
    expect(await poSidebar.getAttributeCountFromLink('power')).toBe('1');
  });

  it('should display display persons in table sorted by name', async() => {
    let names = await poTable.getPersonNames();
    expect(names.length).toBe(3);
    expect(names[0]).toBe('Albert Einstein');
    expect(names[2]).toBe('Zaphod Beeblebrox');
  });

  it('should sort and update table', async() => {
    let names;
    await poTable.sort('power');
    await browser.driver.sleep(500);
    names = await poTable.getPersonNames();
    expect(names.length).toBe(3);
    expect(names[2]).toBe('Zaphod Beeblebrox');

    await poTable.sort('rich');
    await browser.driver.sleep(500);
    names = await poTable.getPersonNames();
    expect(names.length).toBe(3);
    expect(names[2]).toBe('Bill Gates');

    await poTable.sort('genius');
    await browser.driver.sleep(1000);
    names = await poTable.getPersonNames();
    expect(names.length).toBe(3);
    expect(names[2]).toBe('Bill Gates');

    await poTable.sort('name');
    await browser.driver.sleep(500);
    names = await poTable.getPersonNames();
    expect(names.length).toBe(3);
    expect(names[2]).toBe('Albert Einstein');
    expect(names[0]).toBe('Zaphod Beeblebrox');
  });

  it('should have attribute filter routes and navigate to', async() => {
    let names;

    poRouter.navigateTo('');
    await browser.driver.sleep(500);
    poRouter.navigateTo('rich');
    await browser.driver.sleep(500);
    expect(await browser.getTitle()).toBe('Rich');
    names = await poTable.getPersonNames();
    expect(names.length).toBe(1);
    expect(names[0]).toBe('Bill Gates');

    poRouter.navigateTo('');
    await browser.driver.sleep(500);
    poRouter.navigateTo('power');
    await browser.driver.sleep(500);
    names = await poTable.getPersonNames();
    expect(await browser.getTitle()).toBe('Superpower');
    expect(names.length).toBe(1);
    expect(names[0]).toBe('Zaphod Beeblebrox');

    poRouter.navigateTo('');
    await browser.driver.sleep(500);
    poRouter.navigateTo('genius');
    await browser.driver.sleep(500);
    names = await poTable.getPersonNames();
    expect(await browser.getTitle()).toBe('Genius');
    expect(names.length).toBe(2);
    expect(names[0]).toBe('Albert Einstein');

    poRouter.navigateTo('');
    await browser.driver.sleep(500);
    names = await poTable.getPersonNames();
    expect(await browser.getTitle()).toBe('Total persons');
    expect(names.length).toBe(3);
  });

  it('add new person with defaults attributes and default name sorting and update views', async() => {
    await poAddPerson.addPerson('foo');
    await browser.driver.sleep(500);
    let error = await poAddPerson.getError();
    let names = await poTable.getPersonNames();

    expect(error).toBe('');
    expect(await poSidebar.getTotalFromFirstLink()).toBe('4');
    expect(await poSidebar.getAttributeCountFromLink('rich')).toBe('1');
    expect(await poSidebar.getAttributeCountFromLink('genius')).toBe('2');
    expect(await poSidebar.getAttributeCountFromLink('power')).toBe('1');
    expect(names.length).toBe(4);
    expect(names[2]).toBe('foo');
  });

  it('add new person with set attributes and default name sorting and update views', async() => {
    await poAddPerson.addPerson('bar', {genius: true, power: true, rich: true});
    await browser.driver.sleep(500);
    let error = await poAddPerson.getError();
    let names = await poTable.getPersonNames();

    expect(error).toBe('');
    expect(await poSidebar.getTotalFromFirstLink()).toBe('4');
    expect(await poSidebar.getAttributeCountFromLink('rich')).toBe('2');
    expect(await poSidebar.getAttributeCountFromLink('genius')).toBe('3');
    expect(await poSidebar.getAttributeCountFromLink('power')).toBe('2');
    expect(names.length).toBe(4);
    expect(names[1]).toBe('bar');
  });

  it('try add new person without name and show validation error', async() => {
    await poAddPerson.addPerson(undefined, {genius: true, power: true, rich: true});
    await browser.driver.sleep(500);
    let error = await poAddPerson.getError();
    let names = await poTable.getPersonNames();

    expect(error).toBe('Name is required.');
    expect(names.length).toBe(3);
    expect(await poSidebar.getTotalFromFirstLink()).toBe('3');
    expect(await poSidebar.getAttributeCountFromLink('rich')).toBe('1');
    expect(await poSidebar.getAttributeCountFromLink('genius')).toBe('2');
    expect(await poSidebar.getAttributeCountFromLink('power')).toBe('1');
    expect(names.length).toBe(3);
  });

  it('try delete person and cancel', async() => {
    await poTable.deletePersonAndCancel();
    await browser.driver.sleep(500);
    let names = await poTable.getPersonNames();

    expect(await poSidebar.getTotalFromFirstLink()).toBe('3');
    expect(names.length).toBe(3);
  });

  it('try delete person, confirm and update views', async() => {
    await poTable.deletePersonAndConfirm();
    await browser.driver.sleep(500);
    let names = await poTable.getPersonNames();

    expect(await poSidebar.getTotalFromFirstLink()).toBe('2');
    expect(names.length).toBe(2);
    expect(await poSidebar.getAttributeCountFromLink('rich')).toBe('1');
    expect(await poSidebar.getAttributeCountFromLink('genius')).toBe('1');
    expect(await poSidebar.getAttributeCountFromLink('power')).toBe('1');
    expect(names[0]).toBe('Bill Gates');
  });
});
