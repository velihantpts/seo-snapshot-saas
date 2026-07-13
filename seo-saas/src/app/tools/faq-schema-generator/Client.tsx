'use client';
import SchemaBuilder from '../_components/SchemaBuilder';
import { faqConfig } from '../_components/schemaConfigs';

export default function Client() {
  return <SchemaBuilder config={faqConfig} />;
}
