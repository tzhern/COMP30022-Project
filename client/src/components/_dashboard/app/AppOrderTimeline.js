import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// material
import { Card, Typography, CardHeader, CardContent } from '@material-ui/core';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot
} from '@material-ui/lab';
// utils
import Cookies from 'js-cookie';
import axios from '../../../commons/axios';
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool
};

function OrderItem({ item, isLast }) {
  const { type, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              (type === 'order1' && 'primary.main') ||
              (type === 'order2' && 'success.main') ||
              (type === 'order3' && 'info.main') ||
              (type === 'order4' && 'warning.main') ||
              'error.main'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function AppOrderTimeline() {
  const [timelines, setTimelines] = useState([]);
  // Get all orders
  useEffect(() => {
    if (Cookies.get('token')) {
      axios
        .get('/order', {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        })
        .then((response) => {
          if (response.status === 200) {
            const newTimeLines = [];
            let len = 5;
            if (response.data.length < 5) {
              len = response.data.length;
            }
            for (let i = 0; i < len; i += 1) {
              newTimeLines.push({
                title:
                  `${response.data[response.data.length - i - 1].customerId.givenName} ` +
                  `${response.data[response.data.length - i - 1].customerId.familyName}`,
                time: `${response.data[response.data.length - i - 1].orderTime}`,
                type: `order${i + 1}`
              });
            }
            console.log(newTimeLines);
            setTimelines(newTimeLines);
          }
        })
        .catch(() => {
          console.log('get orders failed');
        });
    }
  }, []);

  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader title="Order Timeline" />
      <CardContent>
        <Timeline>
          {timelines.map((item, index) => (
            <OrderItem key={item.type} item={item} isLast={index === timelines.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
