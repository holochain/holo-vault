const test = require('tape');
module.exports = (scenario) => {

  const testFieldSpec = {
    name: "handle",
    displayName: "Test Field",
    required: true,
    description: "",
    usage: "STORE",
    schema: ""
  }

  const testProfileSpec = {
    name: "something",
    sourceDNA: "xxx",
    fields: [testFieldSpec]
  }

  scenario.runTape('Can register a profile spec', async (t,  {alice}) => {
    const register_result = await alice.callSync("profiles", "register_app", {spec: testProfileSpec})
    console.log(register_result)
    t.notEqual(register_result.Ok, undefined)
  })

  scenario.runTape('Can get a list of profiles', async (t, {alice}) => {
    const register_result = await alice.callSync("profiles", "register_app", {spec: testProfileSpec})
    t.notEqual(register_result.Ok, undefined)
    const get_result = await alice.callSync("profiles", "get_profiles", {})
    console.log(get_result)
    t.deepEqual(get_result.Ok.length, 1)
  })

  scenario.runTape('Can register a profile spec', async (t,  {alice}) => {
    const register_result = await alice.callSync("profiles", "register_app", {spec: testProfileSpec})
    t.notEqual(register_result.Ok, undefined)

    // can callSync the function with garbage data
    const map_result1 = await alice.callSync("profiles", "create_mapping",
      {
        mapping: {
          retrieverDNA: "xxx",
          profileFieldName: "xxx",
          personaAddress: "xxx",
          personaFieldName: "dd"
        }
      })
    console.log(map_result1)
    // should not map any fields
    t.deepEqual(map_result1.Ok, { mappings_created: 0 }, "should not create a mapping as there are no matching fields");

    // create a persona to map to and add a field
    const result = await alice.callSync("personas", "create_persona", {spec: {name: "mapToPersona"}})
    const personaAddress = result.Ok
    const add_result = await alice.callSync("personas", "add_field", {persona_address: personaAddress, field: {name: "test_field", data: "string data"}})


    // can callSync the function to create a mapping
    const map_result2 = await alice.callSync("profiles", "create_mapping",
      {
        mapping: {
          retrieverDNA: "xxx",
          profileFieldName: "handle",
          personaAddress: personaAddress,
          personaFieldName: "test_field"
        }
      })
    console.log(map_result2)
    // should map a single field
    t.deepEqual(map_result2.Ok, { mappings_created: 1 }, "a single mapping should be created");

    // can then see the field is mapped
    const get_result = await alice.callSync("profiles", "get_profiles", {})
    console.log(get_result)
    t.deepEqual(get_result.Ok.filter(p => p.name === "something")[0].fields[0].mapping, {personaAddress: personaAddress, personaFieldName: 'test_field'})
  })
}
