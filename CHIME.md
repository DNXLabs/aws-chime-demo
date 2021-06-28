# Chime SDK js


### Create meeting

```js
await chime.createMeeting({
    // Use a UUID for the client request token to ensure that any request retries
    // do not create multiple meetings.
    ClientRequestToken: uuidv4(),
    // Specify the media region (where the meeting is hosted).
    // In this case, we use the region selected by the user.
    MediaRegion: requestUrl.query.region,
    // Any meeting ID you wish to associate with the meeting.
    // For simplicity here, we use the meeting title.
    ExternalMeetingId: requestUrl.query.title.substring(0, 64),
}).promise();
```


### Create new attendee for the meeting

```js
const attendee = await chime.createAttendee({
    // The meeting ID of the created meeting to add the attendee to
    MeetingId: meeting.Meeting.MeetingId,

    // Any user ID you wish to associate with the attendeee.
    // For simplicity here, we use a random id for uniqueness
    // combined with the name the user provided, which can later
    // be used to help build the roster.
    ExternalUserId: `${uuidv4().substring(0, 8)}#${requestUrl.query.name}`.substring(0, 64),
}).promise()
```

###  End the meeting

> All attendee connections will hang up.

```js
await chime.deleteMeeting({
    MeetingId: meetingTable[requestUrl.query.title].Meeting.MeetingId,
}).promise();
```