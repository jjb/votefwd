update voters set confirmed_sent_at=null where confirmed_sent_at is not null;
update voters set adopted_at=null where adopted_at is not null;
update voters set plea_letter_url=null where plea_letter_url is not null;
update voters set adopter_user_id=null where adopter_user_id is not null;
update voters set pledge_made_at=null where pledge_made_at is not null;
