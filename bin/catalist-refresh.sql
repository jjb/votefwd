DO $$

DECLARE
  -- SET THIS BY INSPECTING THE EXPERIMENTS TABLE --
  experimentid integer := 1;

  populationtotal integer;
  votercount integer := 8356;
  timestamp timestamp := now();

BEGIN

  -- GRAB <votercount> VOTERS WHO ARE CURRENTLY MARKED 'CONTROL'
  -- AT RANDOM AND UPDATE THEIR DESIGNATIONS TO 'TEST'

  UPDATE experiment_voter
  SET cohort = 'TEST',
      updated_at = timestamp,
      experiment_id = 10
  WHERE experiment_voter.voter_id IN
  (
    SELECT voter_id FROM experiment_voter
    WHERE experiment_id = experimentid
    AND cohort = 'CONTROL'
    ORDER BY RANDOM()
    LIMIT votercount
  );

  RAISE NOTICE 'Timestamp: %', timestamp;
  RAISE NOTICE 'Assigned % more voters to TEST group.', votercount;

  -- POPULATE SELECTED TEST SUBJECTS INTO VOTERS TO MAKE ADOPTABLE

  INSERT INTO voters
    ( registration_id,
      first_name,
      middle_name,
      last_name,
      suffix,
      address,
      city,
      state,
      zip,
      age,
      gender,
      district_id
    )
  SELECT dwid,
    first_name,
    middle_name,
    last_name,
    name_suffix,
    concat_ws(' ', mail_address_line_1, mail_address_line_2),
    mail_address_city,
    mail_address_state,
    mail_address_zip,
    age::text::int,
    gender,
    'OH12'
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST'
  AND experiment_voter.updated_at = timestamp;

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
