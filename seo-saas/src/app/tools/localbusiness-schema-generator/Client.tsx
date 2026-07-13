'use client';
import SchemaBuilder from '../_components/SchemaBuilder';
import { localBusinessConfig } from '../_components/schemaConfigs';

export default function Client() {
  return <SchemaBuilder config={localBusinessConfig} />;
}
