DO $$

DECLARE
  experimentid integer;
  votercount integer := 1000;

BEGIN

  -- DESCRIBE THE EXPERIMENT

  INSERT INTO experiment VALUES
    (DEFAULT, 'OHIO_SPECIAL', 'Special election, test of timing and letter variants, no reply cards.')
    RETURNING id INTO experimentid;

  -- INSERT IDs OF ALL POSSIBLE TARGETS INTO EXPERIMENT TRACKING TABLE

  INSERT INTO experiment_voter (voter_id, experiment_id)
  SELECT sos_voterid, experimentid
  FROM ohio_12_wide
  WHERE party_affiliation='D'
    AND general_11_08_2016='X'
    AND primary_05_02_2017!='X'
    AND primary_09_12_2017!='X'
    AND general_11_07_2017!='X'
    AND voter_status='ACTIVE'
    AND mailing_address1='';

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
  SELECT sos_voterid,
    first_name,
    middle_name,
    last_name,
    suffix,
    residential_address1 || ' ' || residential_secondary_addr,
    residential_city,
    residential_state,
    residential_zip,
    date_of_birth
  FROM ohio_12_wide
  JOIN experiment_voter
  ON experiment_voter.voter_id = ohio_12_wide.sos_voterid
  WHERE experiment_voter.cohort = 'TEST';

  RAISE NOTICE 'Populated voters table with new TEST voters.';

END$$;
