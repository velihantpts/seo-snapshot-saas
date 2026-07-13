'use client';
import SchemaBuilder from '../_components/SchemaBuilder';
import { eventConfig } from '../_components/schemaConfigs';

export default function Client() {
  return <SchemaBuilder config={eventConfig} />;
}
