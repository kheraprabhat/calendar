import { Event } from './types';
import { v4 as UUID } from 'uuid';
import * as Yup from 'yup';
import { DateTimeField } from './DateTimeField';
import {
  Form,
  Field,
  withFormik,
  FormikProps,
  FormikBag
} from 'formik';
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";
import { useContext } from 'react';
import { CalendarContext } from './providers/CalendarContext';

interface AddEventFormProps {
  onAddEvent: (event: Event) => void;
  onEditEvent: (event: Event) => void;
  resetEventForm: () => void;
  initialValues: Event;
}

const InnerForm = (props: AddEventFormProps & FormikProps<Event>) => {
  const { touched, isSubmitting, errors, values } = props;
  function handleReset() {
    props.resetForm();
    props.resetEventForm();
  }
  return (
    <Form className='events-form'>
      <h1>{values.id ? 'Edit' : 'Add'} an event</h1>
      <Field type="hidden" name="id" />
      <div className='events-form__field'>
        <label htmlFor="title">Title</label>
        <Field id="title" name="title" placeholder="Title" />
        {touched.title && errors.title && <div className='events-form__error'>{errors.title}</div>}
      </div>
      <div className='events-form__field'>
        <label htmlFor="description">Description</label>
        <Field id="description" name="description" placeholder="Description" as="textarea" />
        {touched.description && errors.description && <div className='events-form__error'>{errors.description}</div>}
      </div>
      <div className='events-form__field'>
        <label htmlFor="startDate">Start Time</label>
        <Field id="startDate" name="startDate" placeholder="Start Date" as={DateTimeField} />
        {touched.startDate && errors.startDate && <div className='events-form__error'>Required</div>}
      </div>
      <div className='events-form__field'>
        <label htmlFor="endDate">End Time</label>
        <Field id="endDate" name="endDate" placeholder="End Date" as={DateTimeField} />
        {touched.endDate && errors.endDate && <div className='events-form__error'>Required</div>}
      </div>
      <button className='events-form__submit' type="submit" disabled={isSubmitting}>Submit</button>
      <button className='events-form__reset' type="reset" onClick={handleReset}>Reset</button>
    </Form>
  );
};

const validationSchema = Yup.object().shape({
  id: Yup.string(),
  title: Yup.string()
    .required('Title is required'),
  description: Yup.string()
    .required('Description is required'),
  startDate: Yup.string()
    .required('Start date is required'),
  endDate: Yup.string()
    .required('End date is required'),
});

function handleSubmit(values: Event, { props, setSubmitting }: FormikBag<AddEventFormProps, Event>) {
  if (values.id) {
    props.onEditEvent(values);
  } else {
    values.id = UUID();
    props.onAddEvent(values);
  }
  setSubmitting(false);
  props.resetEventForm();
}

const AddEventForm = withFormik<AddEventFormProps, Event>({
  mapPropsToValues: props => {
    return {
      ...props.initialValues
    };
  },
  validationSchema,
  handleSubmit,

  enableReinitialize: true,
})(InnerForm);

export default function AddEvent() {

  const { dispatch, state: { selectedEvent, events } } = useContext(CalendarContext);

  let initialValues: Event = {
    id: '',
    title: '',
    description: '',
    startDate: moment().unix(),
    endDate: moment().unix(),
  };

  if (selectedEvent) {
    const event = events.find(e => e.id === selectedEvent);
    initialValues = event || initialValues;
  }

  return (<AddEventForm
    onAddEvent={(event) => dispatch({ type: 'ADD_EVENT', data: event })}
    onEditEvent={(event) => dispatch({ type: 'EDIT_EVENT', data: event })}
    initialValues={initialValues}
    resetEventForm={() => dispatch({ type: 'SELECT_EVENT', data: '' })}
  />)
}
