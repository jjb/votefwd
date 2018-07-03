DO $$

DECLARE
  experimentid integer;
  votercount integer := 2000;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'OHIO_SPECIAL', 'Special election, letters with pledge codes and without reply cards.')
    RETURNING id INTO experimentid;

  -- INSERT IDs OF ALL POSSIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT dwid, experimentid
  FROM catalist_raw;

  -- INITIALIZE ALL POSSIBLE TARGETS AS CONTROLS --

  UPDATE experiment_voter
  SET cohort = 'CONTROL'
  WHERE experiment_voter.voter_id IN
  (
    SELECT voter_id FROM experiment_voter
    WHERE experiment_id = experimentid
    AND cohort is null
    ORDER BY RANDOM()
    LIMIT votercount
  );

  RAISE NOTICE 'Registered experiment as id: %', experimentid;

  -- GRAB SOME VOTERS AT RANDOM AND UPDATE THEIR DESIGNATIONS

  UPDATE experiment_voter
  SET cohort = 'TEST'
  WHERE experiment_voter.voter_id IN
  (
    SELECT voter_id FROM experiment_voter
    WHERE experiment_id = experimentid
    AND cohort is null
    ORDER BY RANDOM()
    LIMIT votercount
  );

  RAISE NOTICE 'Assigned % voters to TEST group.', votercount;

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
      date_of_birth
    )
  SELECT dwid,
    first_name,
    middle_name,
    last_name,
    name_suffix,
    residential_address_line_1 || ' ' || residential_address_line_2,
    residential_address_city,
    residential_address_state,
    residential_address_city,
    residential_address_zip,
    date_of_birth
  FROM catalist_raw
  JOIN experiment_voter
  ON experiment_voter.voter_id = catalist_raw.dwid
  WHERE experiment_voter.cohort = 'TEST';

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
