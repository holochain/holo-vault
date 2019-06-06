#![feature(try_from)]
#[macro_use]
extern crate hdk;
extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate holochain_core_types_derive;

use crate::persona::Persona;
use hdk::utils::GetLinksLoadResult;
use hdk::{
    error::{ZomeApiResult},
    holochain_core_types::{cas::content::Address, json::JsonString, json::RawString, error::HolochainError},
    holochain_core_types::dna::entry_types::Sharing,
};

pub mod persona;
pub type Base = RawString;

pub static PERSONA_ENTRY: &str = "persona";
pub static PERSONA_FIELD_ENTRY: &str = "persona_field";
pub static PERSONA_ANCHOR_ENTRY: &str = "persona_anchor";

pub static PERSONA_FIELDS_LINK_TYPE: &str = "fields";
pub static PERSONA_ANCHOR_LINK_TYPE: &str = "personas";


 define_zome! {

	entries: [
		persona::persona_definition(),
        persona::field_definition(),
		entry!(
			name: PERSONA_ANCHOR_ENTRY,
	        description: "",
	        sharing: Sharing::Public,

            validation_package: || {
                hdk::ValidationPackageDefinition::Entry
            },
            validation: | _validation_data: hdk::EntryValidationData<Base>| {
                Ok(())
            },

            links: [
                to!(
                    PERSONA_ENTRY,
                    link_type: PERSONA_ANCHOR_LINK_TYPE,
                    validation_package: || {
                        hdk::ValidationPackageDefinition::Entry
                    },
                    validation: | _validation_data: hdk::LinkValidationData| {
                        Ok(())
                    }
                )
            ]
		)
	]

    genesis: || {
        {
            Ok(())
        }
    }

    functions: [
		create_persona: {
			inputs: |spec: persona::PersonaSpec|,
			outputs: |result: ZomeApiResult<Address>|,
			handler: persona::handlers::handle_create_persona
		}
		get_personas: {
			inputs: | |,
			outputs: |personas: ZomeApiResult<Vec<GetLinksLoadResult<Persona>>>|,
			handler: persona::handlers::handle_get_personas
		}
        add_field: {
            inputs: |persona_address: Address, field: persona::PersonaField|,
            outputs: |result: ZomeApiResult<()>|,
            handler: persona::handlers::handle_add_field
        }
        get_field: {
            inputs: |persona_address: Address, field_name: String|,
            outputs: |result: ZomeApiResult<RawString>|,
            handler: persona::handlers::handle_get_field
        }
	]

    traits: {
        hc_public [create_persona, get_personas, add_field, get_field]
    }
 }
