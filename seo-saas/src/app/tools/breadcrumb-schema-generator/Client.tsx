'use client';
import SchemaBuilder from '../_components/SchemaBuilder';
import { breadcrumbConfig } from '../_components/schemaConfigs';

export default function Client() {
  return <SchemaBuilder config={breadcrumbConfig} />;
}
