SELECT
  sos_voterid,
  first_name, 
  middle_name, 
  last_name, 
  suffix,
  residential_address1,
  residential_secondary_addr,
  residential_city,
  residential_state,
  residential_zip,
  date_of_birth
FROM ohio_12_wide 
WHERE party_affiliation='D' 
  AND general_11_08_2016='X' 
  AND primary_05_02_2017!='X' 
  AND primary_09_12_2017!='X' 
  AND general_11_07_2017!='X' 
  AND voter_status='ACTIVE' 
  AND mailing_address1=''
