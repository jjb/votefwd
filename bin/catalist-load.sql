DO $$

BEGIN

  COPY catalist_raw(
    dwid,
    state,
    hhid1,
    hhid2,
    name_prefix,
    first_name,
    middle_name,
    last_name,
    name_suffix,
    age,
    gender,
    race,
    registration_address_line_1,
    registration_address_line_2,
    registration_address_city,
    registration_address_state,
    registration_address_zip,
    registration_address_zip_plus_4,
    mail_address_line_1,
    mail_address_line_2,
    mail_address_city,
    mail_address_state,
    mail_address_zip,
    mail_address_zip_plus_4,
    county_name,
    township,
    precinct_code,
    precinct_name,
    unique_precinct_code,
    unique_precinct_name,
    ward,
    congressional_district,
    state_house_district,
    state_senate_district,
    municipal_district,
    school_board,
    precinct_split,
    city_council,
    likely_cell,
    likely_cell_restricted,
    likely_cell_connectivity_score,
    likely_cell_assignment_score,
    likely_landline,
    likely_landline_restricted,
    likely_landline_connectivity_score,
    likely_landline_assignment_score
  )

  FROM '/tmp/CATALIST_OH_Vote_Forward_Mailing_PHONE.csv'
  DELIMITER ','
  CSV HEADER;

END$$;
