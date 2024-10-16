import React, { useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Stack,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper, // Import Paper component
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Example icon for the logo
import {
  LocalizationProvider,
  DateCalendar,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import PickersDay from '@mui/lab/PickersDay';
import { Bar } from 'react-chartjs-2'; // Import Bar chart component
import 'chart.js/auto'; // Import Chart.js

// Import the logo
import logo from './SBHH_Logo.avif'; // Adjust the path if necessary

export default function App() {
  // Wrap trainData in useMemo to prevent it from changing on every render
  const trainData = useMemo(() => ({
    // Key format: 'YYYY-MM-DD HH:mm'
    '2024-10-01 09:22': {
      id: 'S23945',
      line: 'S5',
      stationTimes: {
        'Hamburg-Neugraben': ['9:22', '9:23'],
        Neuwienthal: ['9:24', '9:24'],
        Heimfeld: ['9:29', '9:29'],
        'Harburg Rathaus': ['9:31', '9:34'],
        'Hamburg-Harburg': ['9:33', '9:37'],
        Wilhelmsburg: ['9:38', '9:40'],
        Veddel: ['9:42', '9:42'],
        Elbbrücken: ['9:44', '9:44'],
        Hammerbrook: ['9:47', '9:49'],
        'Hamburg Hbf': ['9:50', '9:58'],
        Dammtor: ['9:53', '9:55'],
        Sternschanze: ['9:55', '9:57'],
      },
    },
    '2024-10-01 10:22': {
      id: 'S23946',
      line: 'S5',
      stationTimes: {
        'Hamburg-Neugraben': ['10:22', '10:22'],
        Neuwienthal: ['10:24', '10:24'],
        Heimfeld: ['10:29', '10:29'],
        'Harburg Rathaus': ['10:31', '10:31'],
        'Hamburg-Harburg': ['10:33', '10:33'],
        Wilhelmsburg: ['10:38', '10:38'],
        Veddel: ['10:41', '10:41'],
        Elbbrücken: ['10:44', '10:44'],
        Hammerbrook: ['10:47', '10:49'],
        'Hamburg Hbf': ['10:50', '10:52'],
        Dammtor: ['10:53', '10:55'],
        Sternschanze: ['10:55', '10:57'],
      },
    },

    '2024-10-15 11:22': {
      id: 'S23946',
      line: 'S5',
      stationTimes: {
        'Hamburg-Neugraben': ['11:22', '11:22'],
        Neuwienthal: ['11:24', '11:24'],
        Heimfeld: ['11:29', '11:29'],
        'Harburg Rathaus': ['11:31', '11:31'],
        'Hamburg-Harburg': ['11:33', '11:33'],
        Wilhelmsburg: ['11:38', '11:45'],
        Veddel: ['11:45', '11:49'],
        Elbbrücken: ['11:49', '11:52'],
        Hammerbrook: ['11:52', '11:55'],
        'Hamburg Hbf': ['11:55', '11:55'],
        Dammtor: ['11:55', '11:57'],
        Sternschanze: ['11:57', '11:59'],
      },
    },
    // ... More trains for other dates and times
  }), []);

  // State Management
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTrainId, setSelectedTrainId] = React.useState('');
  const [availableTrains, setAvailableTrains] = React.useState([]);
  const [selectedTrain, setSelectedTrain] = React.useState(null);

  // Update available trains when selectedDate changes
  React.useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.format('YYYY-MM-DD');
      console.log(dateStr);

      // Filter trains based on the selected date
      const filteredTrains = Object.entries(trainData)
        .filter(([key]) => key.startsWith(dateStr))
        .map(([, train]) => train);

      setAvailableTrains(filteredTrains);
      setSelectedTrainId('');
      setSelectedTrain(null);
    } else {
      setAvailableTrains([]);
      setSelectedTrainId('');
      setSelectedTrain(null);
    }
  }, [selectedDate]);

  // Update selectedTrain when selectedTrainId changes
  React.useEffect(() => {
    if (selectedTrainId) {
      const train = availableTrains.find((t) => t.id === selectedTrainId);
      setSelectedTrain(train || null);
    } else {
      setSelectedTrain(null);
    }
  }, [selectedTrainId, availableTrains]);

  // Helper function to highlight available dates
  const renderHighlightedDay = (date, selectedDates, pickersDayProps) => {
    const isAvailable = availableTrains.some((train) =>
      Object.keys(train.stationTimes).some((station) =>
        train.stationTimes[station].some((time) => time.startsWith(date.format('HH:mm')))
      )
    );

    return (
      <PickersDay
        {...pickersDayProps}
        sx={{
          backgroundColor: isAvailable ? 'lightgreen' : undefined,
          '&:hover': {
            backgroundColor: isAvailable ? 'lightgreen' : undefined,
          },
        }}
      />
    );
  };

  // Generating Timeline Items
  const timelineItems =
    selectedTrain &&
    Object.entries(selectedTrain.stationTimes).map(([station, times], index) => {
      const [scheduled, actual] = times;
      const scheduledMinutes = timeToMinutes(scheduled);
      const actualMinutes = timeToMinutes(actual);
      const timeDifference = actualMinutes - scheduledMinutes;

      // Determine the color based on time difference
      const dotColor = timeDifference === 0 ? 'success' : 'error';

      return (
        <TimelineItem key={index}>
          <TimelineOppositeContent color="text.secondary">
            <Typography>
              {station}<br /> {/* Line break after the dash */}
              {times[0]} {/* Display first departure time */}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color={dotColor} />
            {index < Object.keys(selectedTrain.stationTimes).length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent color={timeDifference === 0 ? 'success' : 'error'} sx={{ fontSize: '1.2rem' }}>
            {timeDifference === 0
              ? '+ 0 min'
              : `${timeDifference > 0 ? '+' : ''}${timeDifference} min`}
          </TimelineContent>
        </TimelineItem>
      );
    });

  // Prepare data for the bar chart
  const chartData = {
    labels: selectedTrain
      ? Object.entries(selectedTrain.stationTimes)
        .filter(([station, times]) => {
          const [scheduled, actual] = times;
          return timeToMinutes(actual) - timeToMinutes(scheduled) > 0; // Only include stations with delays
        })
        .map(([station]) => station) // Get the station names
      : [],
    datasets: [
      {
        label: 'Delay (minutes)',
        data: selectedTrain
          ? Object.entries(selectedTrain.stationTimes)
            .filter(([station, times]) => {
              const [scheduled, actual] = times;
              return timeToMinutes(actual) - timeToMinutes(scheduled) > 0; // Only include stations with delays
            })
            .map(([station, times]) => {
              const [scheduled, actual] = times;
              return timeToMinutes(actual) - timeToMinutes(scheduled); // Calculate delay
            })
          : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Stack alignItems={'space-between'} justifyContent={'space-between'} spacing={2}>
      {/* AppBar */}
      <AppBar position="static" sx={{ width: '100%', backgroundColor: '#A77EED' }} >
        <Toolbar disableGutters>
          {/* Logo on the left */}
          <img src={logo} alt="SBHH Logo" style={{ height: '40px', marginRight: '20px' }} />
          {/* Centered Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center', mr: 2 }}
          >
            Reisendeninformation
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Grid2 container>
        {/* Sidebar with DateCalendar and Train Selector */}
        <Grid2
          item
          xs={12}
          md={4}
          lg={3}
          sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}
        >
          <Box sx={{ p: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* DateCalendar */}
              <DateCalendar
                date={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}

              />

              {/* Train Selection */}
              {availableTrains.length > 0 && (
                <FormControl fullWidth sx={{ mt: 3 }} >
                  <InputLabel id="train-select-label">Select Train</InputLabel>
                  <Select
                    labelId="train-select-label"
                    id="train-select"
                    value={selectedTrainId}
                    label="Select Train"
                    onChange={(e) => setSelectedTrainId(e.target.value)}
                  >
                    {availableTrains.map((train) => (
                      <MenuItem key={train.id} value={train.id}>
                        {`Line ${train.line} - Departure: ${Object.values(train.stationTimes)[0][0]}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </LocalizationProvider>
          </Box>
        </Grid2>

        {/* Timeline and Chart Section */}
        <Grid2 item xs={12} md={8} lg={9}>
          {/* Header above the Timeline */}
          {selectedTrain && (
            <Container sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
              <Paper sx={{ backgroundColor: 'lightblue', padding: 2, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom>
                  {`S-Bahn ${selectedTrain.line}`}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {`ID: ${selectedTrain.id}`}
                </Typography>
              </Paper>
            </Container>
          )}

          <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={10}>
            {/* Timeline Section */}
            {selectedTrain ? (
              <Stack alignItems="center" justifyContent="center" sx={{ px: 2 }}>
                <Timeline position="right">{timelineItems}</Timeline>
              </Stack>
            ) : (
              <Container sx={{ mt: 4 }}>
                <Typography variant="h6" align="center" color="text.secondary">
                  Please select a date and a specific train to view the timeline.
                </Typography>
              </Container>
            )}

            {/* Bar Chart Section */}
            {selectedTrain && (
              <Container sx={{ mt: 4, width: '600px', height: '400px' }}> {/* Adjust height as needed */}
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Container>
            )}
          </Stack>
        </Grid2>
      </Grid2>
    </Stack>
  );
}

// Helper function to convert time string to minutes since midnight
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
