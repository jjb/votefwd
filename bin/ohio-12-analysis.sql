DO $$

DECLARE
  presidential_08_R_votercount integer;
  presidential_08_R_andanother integer;
  midterm_10_R_votercount integer;
  overlap1 integer;
  overlap2 integer;

BEGIN

DROP TABLE IF EXISTS R_08_ONLY;
DROP TABLE IF EXISTS R_08_ANDANOTHER;
DROP TABLE IF EXISTS R_10_MID;

CREATE TABLE R_08_ONLY (sos_voterid varchar(32) NOT NULL);
CREATE TABLE R_08_ANDANOTHER (sos_voterid varchar(32) NOT NULL);
CREATE TABLE R_10_MID (sos_voterid varchar(32) NOT NULL);

insert into R_08_ONLY (sos_voterid)
select sos_voterid
from ohio_12_wide
where party_affiliation='R'
  and general_11_04_2008='X'
  and general_11_18_2008 !='X'
  and primary_05_05_2009 !='X'
  and primary_09_08_2009 !='X'
  and primary_09_15_2009 !='X'
  and primary_09_29_2009 !='X'
  and general_11_03_2009 !='X'
  and primary_05_04_2010 !='X'
  and primary_07_13_2010 !='X'
  and primary_09_07_2010 !='X';

insert into R_08_ANDANOTHER (sos_voterid)
select sos_voterid
from ohio_12_wide
where party_affiliation='R'
  and general_11_04_2008='X'
  and (general_11_18_2008 ='X'
  OR primary_05_05_2009 ='X'
  OR primary_09_08_2009 ='X'
  OR primary_09_15_2009 ='X'
  OR primary_09_29_2009 ='X'
  OR general_11_03_2009 ='X'
  OR primary_05_04_2010 ='X'
  OR primary_07_13_2010 ='X'
  OR primary_09_07_2010 ='X');

insert into R_10_MID (sos_voterid)
select sos_voterid
from ohio_12_wide
where party_affiliation='R'
  and general_11_02_2010='X';

presidential_08_R_votercount := count(*) from R_08_ONLY;
RAISE NOTICE '% Rs voted in 2008 presidential and nothing else before the midterm', presidential_08_R_votercount;

presidential_08_R_andanother := count(*) from R_08_ANDANOTHER;
RAISE NOTICE '% Rs voted in 2008 presidential and at least one more before the midterm', presidential_08_R_andanother;

midterm_10_R_votercount := count(*) from R_10_MID;
RAISE NOTICE '% Rs voted in 2010 midterm.', midterm_10_R_votercount;

overlap1 := count(*) FROM
  (
  SELECT
    sos_voterid
  FROM
    R_08_ONLY
  INTERSECT
  SELECT
    sos_voterid
  FROM
    R_10_MID
  ) I;

RAISE NOTICE '% Rs who voted in 08 and nothing again before midterm voted in the midterm.', overlap1;

overlap2 := count(*) FROM
  (
  SELECT
    sos_voterid
  FROM
    R_08_ANDANOTHER
  INTERSECT
  SELECT
    sos_voterid
  FROM
    R_10_MID
  ) I;

RAISE NOTICE '% Rs who voted in 08 and at least one more before the midterm voted in the midterm.', overlap2;

DROP TABLE IF EXISTS R_08_ONLY;
DROP TABLE IF EXISTS R_08_ANDANOTHER;
DROP TABLE IF EXISTS R_10_MID;

END$$;
