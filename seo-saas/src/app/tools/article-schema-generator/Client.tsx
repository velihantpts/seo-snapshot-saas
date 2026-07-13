'use client';
import SchemaBuilder from '../_components/SchemaBuilder';
import { articleConfig } from '../_components/schemaConfigs';

export default function Client() {
  return <SchemaBuilder config={articleConfig} />;
}
